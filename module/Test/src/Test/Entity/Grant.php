<?php
namespace Test\Entity;

use Doctrine\ORM\Mapping as ORM;

/** 
 * @ORM\Entity
 * @ORM\Table(name="GroupGrant")
 */
class Grant {
    /**
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 * @ORM\Column(type="integer")
	 */
	protected $id;

	/** @ORM\Column(type="string", length=255, unique=true) */
	protected $name;
	
	/** @ORM\Column(type="boolean", nullable=true) */
	protected $focalpoint;
	
	/** @ORM\ManyToMany(targetEntity="Queue") */
	protected $queues;
	
	public function __construct(){
		$this->queues = new ArrayCollection();
	}

	public function getId(){
	    return $this->id;
	}
    
    public function setId($id){
    	$this->id = $id;
    }
    
    public function getName(){
    	return $this->name;
    }
    
    public function setName($name){
    	$this->name = $name;
    }
    
    public function isFocalpoint(){
    	return $this->focalpoint?:false;
    }
    
    public function setFocalpoint($focalpoint){
    	$this->focalpoint = $focalpoint;
    }
    
    public function getQueues(){
    	return $this->queues;
    }
    
    public function setQueues($queues){
    	$this->queues = $queues;
    }
}